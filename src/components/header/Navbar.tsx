import SignInButton from "./SignInButton";
import SignUpButton from "./SignUpButton";

export default function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
          </div>

          <div className="flex items-center">
            <SignUpButton />
            <SignInButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
