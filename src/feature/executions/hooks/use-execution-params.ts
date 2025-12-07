import {useQueryStates} from 'nuqs'
import {ExecutionParams} from '../params'

export const useExecutionParams=()=>{
    return useQueryStates(ExecutionParams);
}