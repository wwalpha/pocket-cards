//
//  OverallFormatter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/16.
//

import Charts
import Foundation

public class OverallFormatter: NSObject, AxisValueFormatter {
    public func stringForValue(_ value: Double, axis _: AxisBase?) -> String {
        if value < 1 {
            return ""
        }

        switch value {
        case 1:
            return "未学習"
        case 2:
            return "再学習"
        case 3:
            return "復習"
        default:
            return String(Int(value - 3)) + "回"
        }
    }
}
