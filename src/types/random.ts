import type { Todo } from "./todo";

export interface RandomState{
    isRolling:boolean
    selectedId:string|null
    filterTag:string
}

export interface RandomResult{
    todo:Todo|null
    animationDuration:number
}