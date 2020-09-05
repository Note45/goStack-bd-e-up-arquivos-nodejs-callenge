import csvParse from 'csv-parse';
import fs from 'fs';

interface Transctions {
  title: string;
  type: string;
  value: number;
  category: string;
}

async function loadCSV(filePath: string): Promise<Transctions[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines: any[] = [];

  parseCSV.on('data', line => {
    const transaction = {
      title: line[0],
      type: line[1],
      value: Number(line[2]),
      category: line[3],
    };

    lines.push(transaction);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

export default loadCSV;
