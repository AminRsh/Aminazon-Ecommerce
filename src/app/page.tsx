import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";

interface HomeProps {
  searchParams: { page: string }
}


export default async function Home({ searchParams: { page = "1" } }: HomeProps) {

  const currentPage = parseInt(page)

  const pageSize = 6
  const heroItemCount = 1

  const totalItemCount = await prisma.product.count()
  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize)

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  })

  return (
    <div className="flex flex-col items-center">
      {currentPage === 1 && <div className="hero rounded-xl bg-base-200 ">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src={products[0].imageUrl}
            alt={products[0].name}
            height={800}
            width={400}
            className=" max-w-sm rounded-lg shadow-2xl"
            priority
          />
          <div>
            <h1 className="text-5xl font-bold">
              {products[0].name}
            </h1>
            <p className="py-6">{products[0].description}</p>
            <Link href={"/products/" + products[0].id} className="btn-primary btn">
              CHECK IT OUT
            </Link>
          </div>
        </div>
      </div>}

      <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {
          (currentPage === 1 ? products.slice(1) : products).map(product => (
            <ProductCard product={product} key={product.id} />
          ))
        }
      </div>

      <PaginationBar currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
