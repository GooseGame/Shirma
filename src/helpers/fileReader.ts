export const readJsonFile = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
      
		reader.onload = (event) => {
			const result = event.target?.result;
			if (typeof result === 'string') {
				resolve(result);
			} else {
				reject(new Error('Ошибка чтения файла'));
			}
		};
  
		reader.onerror = () => {
			reject(new Error('Ошибка чтения файла'));
		};
  
		reader.readAsText(file);  
	});
};