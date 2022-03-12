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
