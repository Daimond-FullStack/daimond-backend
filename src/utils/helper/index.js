const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

const serverConfig = require('../../config');

// Hash the password before saving to the database
exports.hashValue = async (password) => {
    const saltRounds = serverConfig.BCRYPT.SALT;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

// Verify password during login
exports.compareHashValue = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

exports.generateJWT = (payload) => {
    const secret = serverConfig.JWT.SECRET;
    const expiresIn = serverConfig.JWT.EXPIRATION;

    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
}

exports.verifyJWT = (token) => {
    try {
        const secret = serverConfig.JWT.SECRET;
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return error;
    }
}

exports.generateRandomToken = (length = 32) => {
    return crypto.randomBytes(length).toString("hex");
};

exports.generateProfessionalDiamondID = () => {
    const date = new Date();
    const year = date.getFullYear();

    // Generate a random 4-digit number or UUID for uniqueness
    const randomElement = uuidv4().slice(0, 4).toUpperCase();

    // Format the Diamond ID in a stylish manner
    const diamondID = `DAI-${year}-${randomElement}`;

    return diamondID;
};

exports.excelToJson = async (path) => {
    const excelPath = process.cwd() + "/" + path;
    console.log(excelPath);
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);
    return data;
}

exports.exportFileFunction = async (excelDownload, preFileName, data) => {
    let tempFile = '';

    if (excelDownload) {
        tempFile = await this.excelFileDownload(preFileName, data);

        const allSegments = tempFile.split("/");
        const fileName = allSegments[allSegments.length - 1];
        const folderName = allSegments[allSegments.length - 2];
        const filePath = `download/${folderName}/${fileName}`;
        return { filePath: filePath };
    }
};

exports.excelFileDownload = async (fileName, data) => {
    return new Promise((resolve, reject) => {
        try {
            fs.mkdirSync('./download/excel/', { recursive: true });
            const filePath = `./download/excel/${fileName}.xlsx`;

            // Create a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');

            // Add headers with styling
            const headers = Object.keys(data[0]);
            worksheet.addRow(headers);

            // Apply styles to header row
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White text
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF1F4E78' }, // Blue background
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Add data rows
            data.forEach((row) => {
                worksheet.addRow(Object.values(row));
            });

            // Center-align all cells in the worksheet
            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                });
            });

            // Adjust column widths to fit content
            worksheet.columns.forEach((column) => {
                column.width = 20; // Adjust width as needed
            });

            // Save the workbook to a file
            workbook.xlsx.writeFile(filePath).then(() => resolve(filePath)).catch(reject);
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};

exports.convertToIST = (date) => {
    const utcDate = new Date(date);
    const IST_OFFSET = 5.5 * 60;
    const istDate = new Date(utcDate.getTime() + (IST_OFFSET * 60 * 1000));
    return istDate.toISOString().replace("T", " ").split(".")[0];
}

exports.getExcelFileName = (page) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomElement = uuidv4().slice(0, 4).toUpperCase();
    return `${page}_data_export_${year}-${month}-${day}-${randomElement}`;
};

exports.renderTemplate = async (templatePath, data) => {
    try {
        const templateSource = await fsPromises.readFile(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(templateSource);
        return compiledTemplate(data);
    } catch (error) {
        throw new Error(`Error reading template: ${error.message}`);
    }
}

exports.generatePDF = async (htmlContent, outputPath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content to the page
    await page.setContent(htmlContent);

    // Optionally, generate a PDF or screenshot
    await page.pdf({ path: outputPath, format: 'A4' });

    await browser.close();
}