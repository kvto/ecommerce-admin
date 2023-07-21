import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (
    req: Request,
    {params}  : { params: { productId: string}}
) {

    if(!params.productId) {
        return new NextResponse("Producto id requerido")
    }
    try {
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
        },
        include: {
            image: true,
            category: true,
            size: true,
            color: true
        }
        });
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status: 500})
    }

}


export async function PATCH (
    req: Request,
    {params}  : { params: { storeId: string, productId: string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            image,
            isFeatured,
            isArchived
         } = body;


        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new NextResponse("Nombre requerido", { status: 400 });
        }

        if(!image || !image.length){
            return new NextResponse("Imagenes requerida", { status: 400 });
        }

        if(!price){
            return new NextResponse("Precio requerido", { status: 400 });
        }

        if(!categoryId){
            return new NextResponse("Categoria id requerido", { status: 400 });
        }

        if(!colorId){
            return new NextResponse("Color id requerido", { status: 400 });
        }

        if(!sizeId){
            return new NextResponse("Tamaño id requerido", { status: 400 });
        }


        if(!params.productId){
            return new NextResponse("Producto Id requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403})
        }


        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                image: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where:{
                id: params.productId
            },
            data: {
                image:{
                    createMany: {
                        data: [
                            ...image.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", {status: 500})
    }

}

export async function DELETE (
    req: Request,
    {params}  : { params: {storeId: string, productId: string}}
) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if(!params.productId){
            return new NextResponse("Producto Id requerido", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403})
        }


        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId
        }
        });
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", {status: 500})
    }

}