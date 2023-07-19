import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage =  async ({
    params
}: {
    params: { sizesId: string }
}) => {
    const sizes = await prismadb.size.findUnique({
        where: {
            id: params.sizesId
        } 
    });
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={sizes}/>
            </div>
        </div>
     );
}
 
export default SizePage;