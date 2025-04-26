export function generateGlobalKeyHandling(
	wasCtrl: boolean,
	inputBox: HTMLTextAreaElement
): (event: KeyboardEvent) => void {
	const handler: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
		const isCtrl = event.ctrlKey || event.metaKey;
		if (wasCtrl && event.key == 'v') {
			inputBox.focus();
		}
		if (isCtrl) {
			wasCtrl = true;
			return;
		}
		inputBox.focus();
	};

	return handler;
}
