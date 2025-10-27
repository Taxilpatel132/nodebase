import {  AlertTriangleIcon, Loader2Icon,  MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon,  TrashIcon,  } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
    EmptyMedia

}from "./ui/empty";
import { cn } from "@/lib/utils";
import React from "react";
import{
    Card,
    CardContent,
    CardDescription,
    CardTitle,
}from "@/components/ui/card"

import { DropdownMenu,DropdownMenuContent ,DropdownMenuItem,DropdownMenuTrigger } from "./ui/dropdown-menu";
import { is } from "date-fns/locale";
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

interface StateViewProps{
    message?:string;
}

export const LoadingView=({message}:StateViewProps)=>{
    return (
        <div className="flex  items-center justify-center h-full gap-y-4  flex-1 flex-col ">
            <Loader2Icon className="animate-spin size-6 text-muted-foreground" />
           {!!message &&(<p className="text-sm text-muted-foreground">{message}</p>)}
        </div>
    );
};

export const ErrorView=({message}:StateViewProps)=>{
    return (
        <div className="flex  items-center justify-center h-full gap-y-4  flex-1 flex-col ">
            <AlertTriangleIcon className="size-6 text-red-500" />
           {!!message &&(<p className="text-sm text-red-500">{message}</p>)}
        </div>
    );
};

interface EmptyViewProps extends StateViewProps{
    onNew?: () => void;
}

export const EmptyView=({message, onNew}:EmptyViewProps)=>{
    return (
        <Empty className="border border-dashed bg-white">
            <EmptyHeader>
            <EmptyMedia variant='icon'>
               <PackageOpenIcon className="size-6 text-muted-foreground" />
            </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>
                No items found
            </EmptyTitle>
           { !!message && <EmptyDescription>
                {message}
            </EmptyDescription>}

              { !!onNew && (
                <EmptyContent>
                <Button onClick={onNew} size="sm">
                    <PlusIcon className="size-4 mr-2"/>New Item
                </Button>
                </EmptyContent>
              )}
        </Empty>
    )
}

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className ?: string;
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className,
}: EntityListProps<T>) {
    if (items.length === 0 && emptyView) {
        return <div className="flex-1 flex justify-center items-center">
            <div className="max-w-sm mx-auto">
                {emptyView}
            </div>
        </div>
    }

    return (
       <div className={cn("flex flex-col gap-y-4 ", className)}>
        {items.map((item, index) => (
            <div key={getKey ? getKey(item, index) : index}>
                {renderItem(item, index)}
            </div>
        ))}
       </div>
    );
};

interface EntityItemProps{
    href:string;
    title:string;
    subtitle?:React.ReactNode;
    image?:React.ReactNode;
    actions?:React.ReactNode;
    onRemove?:()=>void| Promise<void>;
    isRemoving?:boolean;
    className?:string;
}

export const EntityItem=({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className,
}:EntityItemProps)=>{
    const hendleRemove=async(e:React.MouseEvent)=>{
        e.preventDefault();
        e.stopPropagation();
        if(isRemoving){
            return;
        }
        if(onRemove){
            await onRemove();
        }

    }

    return (
       <Link href={href} prefetch >
        <Card className={
            cn("p-4 shadow-nonehover:shadow cursor-pointer",
                isRemoving && "opacity-50 cursor-not-allowed",
                className)}>
            <CardContent className="flex flex-row items-center justify-between p-0">
            <div className="flex items-center gap-3">
                {image}
                <div>
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    {!!subtitle && (
                    <CardDescription className="text-xs">
                        {subtitle}
                    </CardDescription>
                    )}
                </div>
            </div>
            {(actions || onRemove) && (
                <div className="flex items-center gap-x-4">
                    {actions}
                    {onRemove && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e)=>e.stopPropagation()}>
                                    <MoreVerticalIcon className="size-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e)=>e.stopPropagation()}>
                                <DropdownMenuItem  onClick={hendleRemove}>
                                    <TrashIcon className="size-4  text-red-500"/>Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            )}
            </CardContent>  
        </Card>
       </Link>
    );
};
