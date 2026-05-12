import Image from "next/image";

export default function AuthLayoutUI({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      
      {/* LEFT */}
      <div className="w-1/2 bg-blue-700 relative flex flex-col justify-between items-center text-white rounded-r-[80px] p-10">

        {/* IMAGE */}
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-md">
                <Image
                src="/images/login-illustration.avif"
                alt="login"
                width={300}
                height={300}
                className="rounded-2xl object-contain"
                />
            </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm opacity-80">
          <p>@ProductivityTracker</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        {children}
      </div>
    </div>
  );
}