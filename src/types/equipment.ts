export interface EquipmentCategory {
    key: string;
    label: string;
    icon: string;
    color: string;
}

export interface EquipmentItem {
    name: string;
    image: string;
    src?: string;
    category: string;
    desc: string;
    info?: Record<string, string>;
    tags?: string[];
    date?: string;
    money?: number;
}

export interface EquipmentData {
    categories: EquipmentCategory[];
    items: EquipmentItem[];
}
