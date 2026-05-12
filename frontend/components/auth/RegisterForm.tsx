import AuthLayoutUI from "./AuthLayoutUI";

export default function RegisterForm() {
  return (
    <AuthLayoutUI>
      <div className="w-[400]">
        <h1 className="text-lg font-semibold text-center mb-6">
            Productivity Tracker
        </h1>

        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 p-2 border-b outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border-b outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border-b outline-none"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-full">
          Create Account
        </button>

        <p className="text-sm mt-4">
          Already have account? <span className="text-blue-500">Login</span>
        </p>

        <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300 opacity-50"></div>
            
            <span className="px-3 text-sm text-gray-400">Or</span>
            
            <div className="flex-1 h-px bg-gray-300 opacity-50"></div>
        </div>

        <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm">
                <img src="/icons/google-symbol.png" className="w-5 h-5" />
                Sign in with Google
            </button>

            <button className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm">
                <img src="/icons/facebook.png" className="w-5 h-5" />
                Sign in with Facebook
            </button>

            <button className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm">
                <img src="/icons/twitter.png" className="w-5 h-5" />
                Sign in with  X
            </button>
        </div>
      </div>
    </AuthLayoutUI>
  );
}