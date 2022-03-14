//
//  StringUtils.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//

import Foundation

class StringUtils {
    static func defaultString(value: String?, defaultValue: String) -> String {
        guard let newValue = value, value == nil else {
            return defaultValue
        }
        
        return newValue
    }
    
    static func defaultEmpty(value: String?) -> String {
        guard let newValue = value, value == nil else {
            return ""
        }
        
        return newValue
    }
}

extension String {
    
    func removeImage() -> String {
        return replacingOccurrences(
            of: #"\[.*\]"#,
            with: "",
            options: .regularExpression
        )
    }
    
    func getImage() -> String {
//        let pattern = #"\[https?://.*\]"#
        let pattern = #"\[.*\]"#
        let regex = try! NSRegularExpression(pattern: pattern, options: [])

        let results = regex.matches(in: self, options: [], range: NSRange(0..<self.count))

        for result in results {
            for i in 0..<result.numberOfRanges {
                let start = self.index(self.startIndex, offsetBy: result.range(at: i).location + 1)
                let end = self.index(start, offsetBy: result.range(at: i).length - 2)
                let text = String(self[start..<end])
                
                return text
            }
        }
        
        return ""
    }
}
