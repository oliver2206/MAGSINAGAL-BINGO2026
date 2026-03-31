import React, { useState, useEffect } from 'react';

const CodeSequenceDisplay = () => {
  const [codes] = useState([
    'G59', '27', 'N42', 'N35', 'G54', 'G46', 'N41', 'G49', 'B',
    'G50', 'G61', 'B12', 'B6', 'N37', 'O68', 'G53', 'N40', 'G47',
    'N63', 'O43', 'G29', 'O1', 'G28'
  ]);
  
  const [selectedCode, setSelectedCode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCodes, setFilteredCodes] = useState(codes);

  // Filter codes based on search
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCodes(codes);
    } else {
      setFilteredCodes(codes.filter(code => 
        code.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm, codes]);

  // Get category and style for each code type
  const getCodeInfo = (code) => {
    if (code.startsWith('G')) {
      return { 
        category: 'G-Code', 
        color: 'bg-blue-500',
        bgColor: 'bg-blue-900/30',
        borderColor: 'border-blue-400',
        description: 'Preparatory function / G-code command'
      };
    } else if (code.startsWith('N')) {
      return { 
        category: 'Line Number', 
        color: 'bg-green-500',
        bgColor: 'bg-green-900/30',
        borderColor: 'border-green-400',
        description: 'Program line number / sequence number'
      };
    } else if (code.startsWith('B')) {
      return { 
        category: 'B-Code', 
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-900/30',
        borderColor: 'border-yellow-400',
        description: 'B-axis or secondary function code'
      };
    } else if (code.startsWith('O')) {
      return { 
        category: 'Program Number', 
        color: 'bg-purple-500',
        bgColor: 'bg-purple-900/30',
        borderColor: 'border-purple-400',
        description: 'Program or subroutine number'
      };
    } else if (!isNaN(parseInt(code))) {
      return { 
        category: 'Numeric Value', 
        color: 'bg-red-500',
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-400',
        description: 'Standalone numeric coordinate or value'
      };
    }
    return { 
      category: 'Unknown', 
      color: 'bg-gray-500',
      bgColor: 'bg-gray-900/30',
      borderColor: 'border-gray-400',
      description: 'Uncategorized code'
    };
  };

  const handleCodeClick = (code, index) => {
    setSelectedCode({ code, index, info: getCodeInfo(code) });
    // Auto-deselect after 3 seconds
    setTimeout(() => setSelectedCode(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            CNC Code Sequence
          </h1>
          <p className="text-gray-300 text-lg">Interactive visualization of G-code and M-code sequence</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search codes (e.g., G59, N42, B12)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">{codes.length}</div>
            <div className="text-xs text-gray-400">Total Codes</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-green-400">{codes.filter(c => c.startsWith('G')).length}</div>
            <div className="text-xs text-gray-400">G-Codes</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-green-400">{codes.filter(c => c.startsWith('N')).length}</div>
            <div className="text-xs text-gray-400">Line Numbers</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400">{codes.filter(c => c.startsWith('B')).length}</div>
            <div className="text-xs text-gray-400">B-Codes</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">{codes.filter(c => c.startsWith('O')).length}</div>
            <div className="text-xs text-gray-400">Program Numbers</div>
          </div>
        </div>

        {/* Code Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCodes.map((code, index) => {
            const codeInfo = getCodeInfo(code);
            const originalIndex = codes.indexOf(code);
            
            return (
              <div
                key={`${code}-${index}`}
                onClick={() => handleCodeClick(code, originalIndex)}
                className={`
                  relative group cursor-pointer transform transition-all duration-300
                  ${codeInfo.bgColor} backdrop-blur-sm rounded-xl p-6 text-center
                  border ${codeInfo.borderColor} hover:scale-105 hover:shadow-xl
                  ${selectedCode?.code === code ? 'ring-4 ring-purple-500 scale-105' : ''}
                `}
              >
                <div className="absolute top-2 right-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${codeInfo.color} bg-opacity-20 text-gray-300`}>
                    {codeInfo.category}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2 font-mono">
                  {code}
                </div>
                <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  #{originalIndex + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Code Details */}
        {selectedCode && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md rounded-xl p-6 border border-purple-500 shadow-2xl animate-in slide-in-from-bottom-5 z-50 min-w-[300px]">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2 font-mono">
                {selectedCode.code}
              </div>
              <div className="text-sm text-gray-300 mb-1">
                Category: <span className="text-purple-300">{selectedCode.info.category}</span>
              </div>
              <div className="text-xs text-gray-400">
                Position: #{selectedCode.index + 1} of {codes.length}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {selectedCode.info.description}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-white text-lg mb-4 text-center">Code Legend</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-300 text-sm">G-Codes (Preparatory Functions)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-300 text-sm">N-Codes (Line Numbers)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-300 text-sm">B-Codes (Secondary Functions)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-gray-300 text-sm">O-Codes (Program Numbers)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-300 text-sm">Numeric Values</span>
            </div>
          </div>
        </div>

        {/* Full Sequence Display */}
        <div className="mt-8 bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-gray-300 text-sm mb-3">Full Sequence</h3>
          <div className="font-mono text-sm text-gray-400 break-all">
            {codes.join(' → ')}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-from-bottom-5 {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-from-bottom-5 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CodeSequenceDisplay;
