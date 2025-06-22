
export enum DiaType {
    Add = 'Add',
    Edit='Edit',
    View='View',
    Clone='Clone'
}

// 弹窗参数接口
export interface IDia {
    show: boolean
    type: DiaType
    // 数据ID
    id?: number
    // 克隆对象
    data?: any
}
