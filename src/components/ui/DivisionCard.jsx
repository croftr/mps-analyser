import * as React from 'react'

import DivisionSvg from '../custom/divisionSvg';

const DivisionCard = ({ item, onQueryDivision }) => {

  return (

    <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 cursor-pointer flex flex-col justify-between" onClick={() => onQueryDivision(item.id)}>
      <div className="flex align-top gap-2">
        <div>
          <DivisionSvg />
        </div>

        <h4 className="text-xl font-semibold dark:text-white line-clamp-3" style={{}}>
          {item.title}
        </h4>
      </div>
      <span className="font-medium text-gray-500 dark:text-gray-400 mt-2">{item.category}</span>
      <span className="font-medium text-gray-400 dark:text-gray-500">{item.date.day.low}/{item.date.month.low}/{item.date.year.low}</span>

      <div className="mt-2 grid grid-cols-3 text-center text-sm border rounded-md border-gray-400 dark:border-gray-600">
        <div className="py-1 border-b border-r border-gray-400 items-center justify-center dark:border-gray-600">Votes</div>
        <div className="py-1 border-b border-r border-gray-600 flex items-center justify-center dark:border-gray-600">Aye</div>
        <div className="py-1 border-b border-gray-600 last:border-r flex items-center justify-center dark:border-gray-600">No</div>
        <div className="py-1 border-r border-gray-600 first:border-l flex items-center justify-center dark:border-gray-600">{item.ayeCount + item.noCount}</div>
        <div className="py-1 border-r border-gray-600 flex items-center justify-center dark:border-gray-600">{item.ayeCount}</div>
        <div className="py-1 border-gray-600 flex items-center justify-center dark:border-gray-600">{item.noCount}</div>
      </div>

    </div>
  )
}

export default DivisionCard;
