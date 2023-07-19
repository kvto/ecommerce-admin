import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (
    req: Request,
    {params}  : { params: { sizesId: string}}
) {
    try {

        if(!params.sizesId){
            return new NextResponse("Tamaño id es requerido", { status: 400})
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizesId
        }
        });
        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", {status: 500})
    }

}


export async function PATCH (
    req: Request,
    {params}  : { params: { storeId: string, sizesId: string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new NextResponse("Nombre requerido", { status: 400 });
        }

        if(!value){
            return new NextResponse("Valor requerido", { status: 400 });
        }


        if(!params.sizesId){
            return new NextResponse("Tamaño id requerido", { status: 400 });
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


        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizesId,
            },
            data: {
                name,
                value
            }
        });
        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal error", {status: 500})
    }

}

export async function DELETE (
    req: Request,
    {params}  : { params: {storeId: string, sizesId: string}}
) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if(!params.sizesId){
            return new NextResponse("Tamaño Id requerido", { status: 400 });
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


        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizesId
        }
        });
        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal error", {status: 500})
    }

}