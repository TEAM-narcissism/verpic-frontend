import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const barColors = ["#ccd5ae", "#e9edc9", "#fefae0", "#faedcd", "#d4a373"]


export default function WPMChart({data}) {

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="wpm"/>
          <Tooltip />
          {/* <Legend /> */}
          <Bar
                    dataKey="wpm"
                    fill="#00a0fc"
                    barSize={30}
                    
                >
                    {
                        data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
                        ))
                    }
                </Bar>
          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>
    );
}
