import { redirect } from "next/navigation"

export default function Custom404Page() {
  redirect("/not-found")
}
