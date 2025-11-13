import { forwardRef } from 'react';
import { Worksheet, WorksheetField } from '@/types/worksheet.type';
import { WorksheetData } from './WorksheetRenderer';

interface PrintableWorksheetProps {
  worksheet: Worksheet;
  data: WorksheetData;
}

export const PrintableWorksheet = forwardRef<HTMLDivElement, PrintableWorksheetProps>(
  ({ worksheet, data }, ref) => {
    const renderFieldValue = (field: WorksheetField) => {
      const value = data[field.fieldId];

      switch (field.type) {
        case 'checkbox':
          return value ? 'Yes' : 'No';

        case 'autocomplete-chips':
          return Array.isArray(value) ? value.join(', ') : '-';

        case 'file':
          return value || '-';

        case 'table':
          const tableData = value || [];
          if (tableData.length === 0) return 'No data';
          
          return (
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  {field.tableColumns?.map((col) => (
                    <th key={col.columnId} className="border border-gray-300 px-4 py-2 text-left">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any, idx: number) => (
                  <tr key={idx}>
                    {field.tableColumns?.map((col) => (
                      <td key={col.columnId} className="border border-gray-300 px-4 py-2">
                        {col.type === 'checkbox' 
                          ? (row[col.columnId] ? 'Yes' : 'No')
                          : (row[col.columnId] || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );

        default:
          return value || '-';
      }
    };

    return (
      <div ref={ref} className="p-8 bg-white text-black">
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 1cm;
              }
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          `}
        </style>

        <div className="mb-8 text-center border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{worksheet.name}</h1>
          <p className="text-sm text-gray-600 mt-2">
            Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
        </div>

        {worksheet.sections.map((section, sectionIndex) => (
          <div
            key={section.sectionId}
            className="mb-8 break-inside-avoid"
            style={{ pageBreakInside: 'avoid' }}
          >
            <div className="bg-gray-100 px-4 py-3 mb-4 border-l-4 border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900">
                {sectionIndex + 1}. {section.name}
              </h2>
            </div>

            <div className="space-y-4 pl-4">
              {section.fields.map((field) => (
                <div key={field.fieldId} className="mb-4">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 min-w-[200px]">
                      {field.name}:
                    </span>
                    <div className="flex-1 text-gray-700">
                      {renderFieldValue(field)}
                    </div>
                  </div>
                  {field.type === 'table' && data[field.fieldId] && (
                    <div className="mt-2">{/* Table is rendered inline above */}</div>
                  )}
                </div>
              ))}
            </div>

            {sectionIndex < worksheet.sections.length - 1 && (
              <hr className="mt-6 border-gray-300" />
            )}
          </div>
        ))}

        <div className="mt-12 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-500">
          <p>End of Report</p>
        </div>
      </div>
    );
  }
);

PrintableWorksheet.displayName = 'PrintableWorksheet';
