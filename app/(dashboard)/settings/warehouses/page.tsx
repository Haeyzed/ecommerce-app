import { WarehousesClient } from "@/features/settings/warehouses"
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Warehouses",
    description: "Manage your warehouses and their visibility.",
}

export default function WarehousesPage() {
    return <WarehousesClient />
}
