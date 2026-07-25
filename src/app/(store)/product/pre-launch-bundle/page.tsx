import { redirect } from "next/navigation";

/** Product page removed — homepage CTAs go straight to checkout. */
export default function ProductPage() {
  redirect("/");
}
