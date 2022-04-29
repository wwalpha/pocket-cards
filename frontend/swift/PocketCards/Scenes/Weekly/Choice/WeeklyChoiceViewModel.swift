//
//  WeeklyChoiceViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

class WeeklyChoiceViewModel: ObservableObject {
    @Published var selection = Set<String>()
    @Published var isLoading = false

    var subject: String = ""
    var dataRows: [Curriculum] = []
    var mode: String = ""

    func selectedRows() -> [Curriculum] {
        dataRows.filter { dataRow in
            selection.contains(dataRow.groupId)
        }
    }
}
