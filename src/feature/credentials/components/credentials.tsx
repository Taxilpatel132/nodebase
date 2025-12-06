'use client';

import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import {  useRemoveCredential, useSuspenseCredentials } from "../hooks/use-cridentials";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialType, type Credential } from "@/generated/prisma";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

const CredentialLogos:Record<CredentialType,string>={
    [CredentialType.OPENAI]: '/logos/openai.svg',
    [CredentialType.ANTHROPIC]: '/logos/anthropic.svg',
    [CredentialType.GOOGLE]: '/logos/gemini.svg',
};
export const CredentialsSearch = () => {
    const [Params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params: Params,
        setParams: setParams,
    })
    return(
        <EntitySearch
           value={searchValue}
           onChange={onSearchChange}
           placeholder="Search Credentils..."       
       />
    );
};


export const CredentialsList = () => {
    
    const credentials=useSuspenseCredentials();
    return (
        <EntityList 
        items={credentials.data.items} 
        getKey={(credential)=>credential.id}
        renderItem={(credential)=><CredentialItem data={credential} />}
        emptyView={<CredentialsEmpty />}      
        />
    )
}

export const CredentialsHeader = ({disabled}:{disabled?:boolean}) => {
  
   
    
    return (
        <>
        
        <EntityHeader 
        title="Credentials" 
        description="Create and Manage your credentials"
       newButtonHref="/credentials/new"
        newButtonLabel="New Credential"
        disabled={disabled}
         />
        </>
    )

}
export const CredentialsPagination = () => {
    const [Params, setParams] = useCredentialsParams();
    const credentials=useSuspenseCredentials();
    return (
        <EntityPagination
        disabled={credentials.isFetching}
        page={credentials.data.page}
        totalPages={credentials.data.totalPages}
        onPageChange={(page:number)=>{
            setParams({
                ...Params,
                page,
            })
        }}/>
    )
};




export const CredentialsContainer = ({children}:{children:React.ReactNode}) => {
    return (
        <EntityContainer
        header={<CredentialsHeader />}
        search ={<CredentialsSearch />}
        pagination={<CredentialsPagination />} 
       >

            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..." />;
}

export const CredentialsError = () => {
    return <ErrorView message="Failed to load credentials." />;
}


export const CredentialsEmpty = () => {
    
    const router = useRouter();
    const handelCreateCredential = () => {
       
                router.push(`/credentials/new`);
            }
       
    

    return <>
      
    <EmptyView message="No credentials found. Create your first credential!" onNew={handelCreateCredential} /></>;
}


export const CredentialItem = ({data}: {data: Credential}) => {
    const removeCredentials=useRemoveCredential();

    const handleRemoveCredentials =  () => {
         removeCredentials.mutate({ id: data.id });
    };
    const logo = CredentialLogos[data.type] || '/logos/openai.svg';
    return (
        <EntityItem
        href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={<>
        Update {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
        &bull;  Created{" "}
        {formatDistanceToNow(data.createdAt,{addSuffix:true})} 
        </>}
        image={
            
            <div className="size-8 flex items-center justify-center">
                <Image src={logo} alt={data.name} width={16} height={16} />
            </div>
        }
        onRemove={handleRemoveCredentials}
        isRemoving={removeCredentials.isPending}
        />
    )
}