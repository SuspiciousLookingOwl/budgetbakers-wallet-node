import { Document, DocumentProps } from "./Document";

export type GoalProps = DocumentProps & {
    note: string;
    desiredDate: string;
    color: string;
    iconName: string;
    targetAmount: number;
    history: History[];
    stateUpdatedAt: string;
    initialAmount: number;
    name: string;
    state: number;
    reservedModelType: "Goal";
};


export interface GoalHistory {
    amount: number;
    authorId: string;
    date: Date;
}

export enum GoalState {
    ACTIVE = 0,
    PAUSED = 1,
    REACHED = 2
}

export class Goal extends Document {
    public note!: string;
    public desiredDate!: Date;
    public color!: string;
    public iconName!: string;
    public targetAmount!: number;
    public history!: GoalHistory[];
    public stateUpdatedAt!: Date;
    public initialAmount!: number;
    public name!: string;
    public state!: number;
    public reservedModelType = "Goal" as const;

    constructor(props: GoalProps) {
        super(props);
        const { desiredDate, stateUpdatedAt, ...rest } = props;
        Object.assign(this, { ...rest });

        this.desiredDate = new Date(desiredDate);
        this.stateUpdatedAt = new Date(stateUpdatedAt);
    }

    public get amount() {
        return this.history.reduce((acc, h) => acc + h.amount, this.initialAmount);
    }
}