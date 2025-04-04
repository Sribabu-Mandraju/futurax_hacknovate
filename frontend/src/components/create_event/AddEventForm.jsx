import { useState, useEffect } from "react";
import axios from "axios";
import { getEventFactoryContract } from "../../config/contract.config";
import toast, { Toaster } from "react-hot-toast";

const AddEventForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    deadline: "",
    image: "",
    category: "Politics", // Default category
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [walletConnected, setWalletConnected] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = "futureX";

  // Check if wallet is connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setWalletConnected(accounts.length > 0);
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletConnected(accounts.length > 0);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    const loadingToast = toast.loading("Uploading image...");

    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formDataObj
      );
      setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
      toast.success("Image uploaded successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setUploading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error(
        "MetaMask not detected! Please install MetaMask to continue."
      );
      return false;
    }

    try {
      const loadingToast = toast.loading("Connecting wallet...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setWalletConnected(true);
        toast.success("Wallet connected successfully!", { id: loadingToast });
        return true;
      } else {
        toast.error("Failed to connect wallet.", { id: loadingToast });
        return false;
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error(`Failed to connect wallet: ${error.message}`);
      return false;
    }
  };

  const saveEventAddress = async (eventAddress) => {
    try {
      const loadingToast = toast.loading("Saving event details...");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/stakeStatus/active`,
        {
          stakeAddress: eventAddress,
          category: formData.category,
        }
      );
      toast.success("Event details saved successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Failed to save event address:", error);
      toast.error("Failed to save event details. Please try again.");
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading(
      "Creating your event on the blockchain..."
    );

    try {
      const eventFactory = await getEventFactoryContract();
      const deadlineInSeconds = Math.floor(
        new Date(formData.deadline).getTime() / 1000
      );

      // Get gas estimate to check if the call will fail
      try {
        await eventFactory.createEvent.estimateGas(
          formData.description,
          formData.image || "https://placeholder.com/400",
          deadlineInSeconds
        );
      } catch (error) {
        console.error("Gas estimation failed:", error);

        // Extract revert reason if available
        let errorMessage = "Transaction would fail";
        if (error.reason) {
          errorMessage += `: ${error.reason}`;
        } else if (
          error.message &&
          error.message.includes("execution reverted")
        ) {
          const match = error.message.match(/execution reverted: (.*?)(?:,|$)/);
          if (match && match[1]) {
            errorMessage += `: ${match[1]}`;
          }
        }

        toast.error(errorMessage, { id: loadingToast });
        setSubmitting(false);
        return;
      }

      // Execute transaction
      const tx = await eventFactory.createEvent(
        formData.description,
        formData.image || "https://placeholder.com/400",
        deadlineInSeconds
      );

      toast.loading("Transaction sent! Waiting for confirmation...", {
        id: loadingToast,
      });
      const receipt = await tx.wait();

      // Get the event from the logs
      const eventLogs = receipt.logs.filter((log) => {
        try {
          return eventFactory.interface.parseLog(log).name === "EventCreated";
        } catch (e) {
          return false;
        }
      });

      if (eventLogs.length > 0) {
        const parsedLog = eventFactory.interface.parseLog(eventLogs[0]);

        // Get event address from the first argument
        const eventAddress = parsedLog.args.eventAddress || parsedLog.args[0];

        if (eventAddress) {
          await saveEventAddress(eventAddress);
          toast.success("🎉 Event created successfully!", {
            id: loadingToast,
            duration: 5000,
          });

          // Reset form
          setFormData({
            description: "",
            deadline: "",
            image: "",
            category: "Politics",
          });
          setPreviewImage(null);
          setCurrentStep(1);
        } else {
          toast.error("Event created but address couldn't be retrieved.", {
            id: loadingToast,
          });
        }
      } else {
        toast.error("Event may have been created but couldn't be verified.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Transaction failed:", error);

      // Extract revert reason if available
      let errorMessage = "Failed to create event";
      if (error.reason) {
        errorMessage += `: ${error.reason}`;
      } else if (
        error.message &&
        error.message.includes("execution reverted")
      ) {
        const match = error.message.match(/execution reverted: (.*?)(?:,|$)/);
        if (match && match[1]) {
          errorMessage += `: ${match[1]}`;
        }
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.description) {
      toast.error("Please enter a description");
      return;
    }
    if (currentStep === 2 && !formData.deadline) {
      toast.error("Please select a deadline");
      return;
    }
    if (currentStep === 3 && !formData.image) {
      toast.error("Please upload an image");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                  ${
                    currentStep === step
                      ? "bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   text-white"
                      : currentStep > step
                      ? "bg-gray-700 text-white"
                      : "bg-gray-800 text-gray-400"
                  }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 ${
                    currentStep > step
                      ? "bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500  "
                      : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
                Event Details
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Describe your event clearly so users understand what they're
                staking on.
              </p>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 bg-[#0e121b] border border-[#1c2333] rounded-lg text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="What is this event about? Be specific and clear..."
                required
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Politics", "Sports", "Finance"].map((category) => (
                  <div
                    key={category}
                    onClick={() => setFormData({ ...formData, category })}
                    className={`p-3 rounded-lg cursor-pointer transition-all text-center
                      ${
                        formData.category === category
                          ? "bg-gradient-to-r from-purple-500/20 via-cyan-400/20 to-blue-500/20 border border-purple-500/50"
                          : "bg-[#0e121b] border border-[#1c2333] hover:border-purple-500/30"
                      }`}
                  >
                    <span
                      className={
                        formData.category === category
                          ? "bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent font-medium"
                          : "text-gray-300"
                      }
                    >
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
                Set Deadline
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Choose when this event will close for staking.
              </p>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-4 bg-[#0e121b] border border-[#1c2333] rounded-lg text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
              <div className="mt-4 p-4 bg-[#0e121b]/50 border border-[#1c2333] rounded-lg">
                <p className="text-gray-400 text-sm">
                  <span className="text-yellow-400">⚠️ Important:</span> After
                  the deadline passes, the event will be locked and no more
                  stakes can be placed. The event creator will have 5 days to
                  resolve the outcome, after which users can claim refunds if
                  not resolved.
                </p>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
                Add Image (Required)
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Upload an image to represent your event.
              </p>
              <div className="border-2 border-dashed border-[#1c2333] rounded-lg p-6 text-center hover:border-purple-500/50 transition-all">
                {previewImage ? (
                  <div className="mb-4">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData({ ...formData, image: "" });
                      }}
                      className="mt-2 text-red-400 text-sm hover:text-red-300"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-500"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-400">
                      Drag and drop an image, or{" "}
                      <label className="text-purple-400 hover:text-purple-300 cursor-pointer">
                        browse
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required
                        />
                      </label>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
              {uploading && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 mr-2"></div>
                  <p className="text-gray-400 text-sm">Uploading...</p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-[#0e121b]/50 border border-[#1c2333] rounded-lg">
              <h4 className="font-medium text-gray-300 mb-2">Event Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Description:</div>
                <div className="text-gray-300 truncate">
                  {formData.description}
                </div>

                <div className="text-gray-400">Category:</div>
                <div className="text-gray-300">{formData.category}</div>

                <div className="text-gray-400">Deadline:</div>
                <div className="text-gray-300">
                  {formData.deadline
                    ? new Date(formData.deadline).toLocaleString()
                    : "Not set"}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mt-[60px]  flex items-center justify-center p-4 md:p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1f3d",
            color: "#fff",
            border: "1px solid #2d2b4d",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#1a1f3d",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1a1f3d",
            },
          },
        }}
      />

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent mb-2">
            Create New Staking Event
          </h1>
          <p className="text-gray-400">
            Set up your event and let users stake on the outcome
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 via-cyan-400/5 to-blue-500/10 p-[1px] rounded-2xl shadow-xl">
          <div className="bg-[#131722] rounded-2xl p-8 backdrop-blur-sm">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit}>
              {renderFormStep()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-[#1c2333] hover:bg-[#252d42] text-gray-300 rounded-lg transition-all"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep <= 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   text-white rounded-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      submitting
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Event...
                      </div>
                    ) : (
                      "Create Event"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            By creating an event, you agree to our{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;
