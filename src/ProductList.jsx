// ProductList.js
import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
//new
import { useInView } from "react-intersection-observer";

const ProductList = () => {
  //new
  const { ref, inView } = useInView();
  const SIZE = 48;
  const LIMIT = 6366;
  //new
  const getAllProduct = async (FROM) => {
    const response = await fetch(
      `https://search.basalam.com/ai-engine/api/v2.0/product/search?from=${FROM}&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=${SIZE}&adsImpressionDisable=false`
    );
    return await response.json();
  };
  //new
  const {
    fetchNextPage,hasNextPage,isFetchingNextPage,data,isSuccess,error,isLoading} = useInfiniteQuery({
    queryKey: "key",
    queryFn: ({ pageParam }) => getAllProduct(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
        // pageParam += 48
      return lastPage.products?.length === LIMIT ? undefined : allPages.length + 48 ;
    },
  });
  console.log("data",data);

  //new
  const content =
  isSuccess &&
  data.pages.map((page , j) =>
    page.products.map((product, i) => {
  console.log(data.pages.length , page.products.length,i ,j);
      if (data.pages.length * page.products.length === (i+1)*(1+j)) {
        return <div ref={ref}>{product.name}</div>;
      }
      return <div>{product.name}</div>;
    })
  );

  //new
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
   <>
        {content}
        {isFetchingNextPage && <h3>Loading...</h3>}
   </>
    
  );
};

export default ProductList;
