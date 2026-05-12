import AuthLayoutUI from "./AuthLayoutUI";

export default function LoginForm() {
  return (
    <AuthLayoutUI>
      <div className="w-[400px]">
        <h1 className="text-lg font-semibold text-center mb-6">
            Productivity Tracker
        </h1>

        <h2 className="text-2xl font-bold mb-6">Sign in</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border-b mb-4 p-2 outline-none bg-transparent"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border-b mb-4 p-2 outline-none bg-transparent"
        />

        <div className="flex justify-between items-center text-sm mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember me
          </label>

          <div className="flex items-center gap-2 text-blue-600 cursor-pointer">
            <img src="/icons/lock.svg" className="w-4 h-4" />
            <span>forgot password?</span>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-full">
          Sign in →
        </button>

        <p className="text-sm mt-6 text-center">
          No account?{" "}
          <span className="text-blue-600 cursor-pointer">Sign up</span>
        </p>

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