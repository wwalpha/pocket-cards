//
//  DateValueFormatter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//

import Charts
import Foundation

public class DateValueFormatter: NSObject, AxisValueFormatter {
    private let dateFormatter = DateFormatter()

    override init() {
        super.init()
        dateFormatter.dateFormat = "yyyy/MM"
        dateFormatter.timeZone = TimeZone(identifier: "Asia/Tokyo")
    }

    public func stringForValue(_ value: Double, axis _: AxisBase?) -> String {
        dateFormatter.string(from: Date(timeIntervalSince1970: value))
    }
}
