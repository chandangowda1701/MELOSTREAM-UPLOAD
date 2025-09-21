import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	const signInWithGoogle = async () => {
		try {
			await signIn.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/sso-callback",
				redirectUrlComplete: "/auth-callback",
			});
		} catch (error: any) {
			console.error("Sign in error:", error);
			toast.error("Failed to sign in with Google. Please try again.");
		}
	};

	return (
		<Button onClick={signInWithGoogle} variant={"secondary"} className='w-full bg-neutral-800 text-white border-zinc-200 h-11'>
			<img src='/google.png' alt='' className='size-5' />
			Continue with Google
		</Button>
	);
};
export default SignInOAuthButtons;