import { signIn } from "src/auth/auth";
import { CredentialsLogin } from "./CredentialsLogin";
import Image from "next/image";

export default function Login() {
  return (
    <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg max-w-xs w-full">
      <div className="text-center mt-5 mb-5">
        <div className="flex items-center justify-center mb-4">
          <Image src="/flinders-icon.png" alt="Flinders University Icon" width={32} height={32} className="mr-2" />
          <h1 className="text-xl font-bold">Flinders University</h1>
        </div>
        <h1 className="text-lg font-bold ">Chemicals Ordering System</h1>
      </div>

      <hr className="border-t-2 border-gray-300 my-4" />

      <div className="text-center mb-10 mt-10">
        <h1 className="text-lg font-bold ">Welcome!</h1>
      </div>

      {/* Okta login */}
      {/* <form    action={async () => {
        "use server";
        await signIn("okta", { redirectTo: "/" });
        }}
        >
          <button type="submit" className={loginButtonClass}>
            Login with Okta
          </button>
        </form> */}

      {/* Google login */}
      <form action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}>
        <button
          className="bg-white hover:bg-slate-400 text-black font-bold py-2 px-4 rounded w-full mb-20 flex items-center justify-center "
          type="submit"
        >
          <Image src="/google.png" alt="Google Icon" width={32} height={32} className="mr-2" />
          <p>Login With Google</p>
        </button>
      </form>

      {/* Credentials for dev */}
      {/* <div className="relative">
        <CredentialsLogin />
      </div> */}

    </div>
  );
}


