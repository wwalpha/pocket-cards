//
//  IntAxisValueFormatter.swift
//  PocketCards
//
//  Created by macmini on 2022/10/09.
//

import Charts
import Foundation

public class IntAxisValueFormatter: NSObject, AxisValueFormatter {
    public func stringForValue(_ value: Double, axis _: AxisBase?) -> String {
        "\(Int(value))"
    }
}
