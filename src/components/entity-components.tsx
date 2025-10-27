import {  PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
}&(
    | {onNew:()=>void; newButtonHref?:never}
    | {newButtonHref:string; onNew?:never}
    |{ onNew?:never; newButtonHref?:never }
)
export const EntityHeader=({
    title,
    description,
    newButtonLabel,
    onNew,
    newButtonHref,
    disabled,
    isCreating,
}:EntityHeaderProps)=>{
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
            { description && 
            <p className="text-xs md:text-sm text-muted-foreground">{description}</p> }
            </div>
            {onNew && !newButtonHref && (
                <Button disabled={isCreating || disabled} onClick={onNew} size="sm">
                    <PlusIcon  className="size-4"/>
                     {newButtonLabel}
                </Button>)}

            { newButtonHref&& !onNew && (
                <Button  asChild size="sm" >
                    <Link href={newButtonHref} prefetch>
                    <PlusIcon  className="size-4"/> 
                        {newButtonLabel}
                    </Link>
                </Button>)}
            
        </div>
    );
} 

type EntityContainerProps={
    children:React.ReactNode;   
    header: React.ReactNode;
    search: React.ReactNode;
    pagination: React.ReactNode;
}

export const EntityContainer=({header, search, pagination, children}:EntityContainerProps)=>{
    return (
      <div className="p-4 md:px-10 md:py-6 h-full">
        <div className="mx-auto max-w-7xl flex flex-col h-full w-full gap-y-8  ">
            {header}
        
        <div className="flex flex-col gap-y-4 h-full">
            {search}
            {children}
            
        </div>
        {pagination}
      </div>
      </div>
    )
}


interface EntitySearchProps{
    value:string;
    onChange:(value:string)=>void;
    placeholder?:string;
}

export const EntitySearch=({
    value,
    onChange,
    placeholder="Search..."
}:EntitySearchProps)=>{
 return (
    <div className="relative ml-auto">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"/>
        <Input className="max-w-[200px] bg-background shadow-none  border-border pl-9 "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        />

    </div>
 )
}

interface EntityPaginationProps{
    page:number;
    totalPages:number;
    onPageChange:(page:number)=>void;
    disabled?:boolean;
}

export const EntityPagination=({
    page,
    totalPages,
    onPageChange,
    disabled,
}:EntityPaginationProps)=>{ 
    return(
        <div className="flex justify-between items-center gap-x-2 w-full ">
         <div className="flex-1 text-sm text-muted-foreground">
            Page {page} of {totalPages||1}
         </div>
         <div className="flex items-center justify-end space-x-2 py-4">
            <Button disabled={disabled || page===1} onClick={() => onPageChange(Math.max(page - 1, 1))} size="sm" variant="outline">
                Previous
            </Button>
            <Button disabled={disabled || totalPages===0 || page===totalPages} onClick={() => onPageChange(Math.min(page + 1, totalPages))} size="sm" variant="outline">
                Next
            </Button>
         </div>
        </div>
    );
};