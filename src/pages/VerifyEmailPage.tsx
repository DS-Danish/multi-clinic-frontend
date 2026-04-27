import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  resendVerificationEmail,
  verifyEmail,
} from "../services/auth.service";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "pending"
  >("loading");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const sent = searchParams.get("sent") !== "0";

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      const response = await resendVerificationEmail(email);
      setStatus("pending");
      setMessage(
        response.message ||
          `We sent a new verification email to ${response.sentTo || email}.`
      );
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Could not resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!token) {
      if (email) {
        setStatus("pending");
        setMessage(
          sent
            ? `We sent a verification email to ${email}. Open the link in that email before signing in.`
            : `Your account was created for ${email}, but we could not send the verification email yet. Use resend to try again.`
        );
      } else {
        setStatus("error");
        setMessage("No verification token or email provided.");
      }
      return;
    }

    setStatus("loading");

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully! You can now log in.");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        const errorMessage = error.response?.data?.message || "Verification failed. The token may be invalid or expired.";
        setMessage(errorMessage);
      }
    };

    verify();
  }, [email, sent, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
      <div className="max-w-md w-full" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
        <div className="bg-white shadow-lg rounded-lg p-8" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
          {status === "loading" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </div>
          )}

          {status === "pending" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              {email && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
              )}
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              {email && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-3"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
              )}
              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center no-underline"
                style={{ pointerEvents: 'auto', zIndex: 1000 }}
              >
                Go to Login Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
