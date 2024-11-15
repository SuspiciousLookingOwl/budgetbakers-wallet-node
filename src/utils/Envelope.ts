import { ENVELOPES } from "../constants";

type Envelope = {
	id: number;
	name: string;
	color: string | null;
	localizationString: string;
	iconName: string;
	parentId: number | null;
	children?: Envelope[];
};

export class EnvelopUtils {
	static getTree() {
		return Object.entries(ENVELOPES).reduce<Envelope[]>((prev, [, envelope]) => {
			if (!envelope.parentId) {
				prev.push(envelope);
			} else if (envelope.parentId) {
				const parentIndex = prev.findIndex((e) => e.id === envelope.parentId);
				if (parentIndex !== -1) {
					if (!prev[parentIndex].children) {
						prev[parentIndex].children = [];
					}

					prev[parentIndex].children.push(envelope);
				}
			}
			return prev;
		}, []);
	}
}
