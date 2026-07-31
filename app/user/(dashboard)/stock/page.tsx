import { redirect } from "next/navigation";

export default function UserStockRedirectPage() {
  redirect("/user/inventory");
}
