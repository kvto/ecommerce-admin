"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";


export const StoreModal = () => {
    const storeModal = useStoreModal();

    return(
    <Modal
    title="Crear tienda"
    description="Agregar una nueva tienda para manejar productos y categorias"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}>
        Formulario para crear una nueva tienda
    </Modal>
    )
    
}