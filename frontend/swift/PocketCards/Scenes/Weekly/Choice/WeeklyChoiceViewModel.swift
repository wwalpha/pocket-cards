//
//  WeeklyChoiceViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

class WeeklyChoiceViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var isConfirmed = false

    var subject: String = ""
    var dataRows: [Curriculum] = []
    var mode: String = ""
    var message: String = ""

    func selectedRows(selection: Set<String>) -> [Curriculum] {
        let results = dataRows.filter { dataRow in
            selection.contains(dataRow.groupId)
        }

        return results
    }

    func checkList() -> [CheckListItem] {
        dataRows.map { item in
            CheckListItem(key: item.groupId, name: item.groupName ?? "dummy")
        }
    }

    func groupId(selection: Set<String>) -> String {
        let id = Array(selection)[0]

        let results = dataRows.filter { dataRow in
            dataRow.groupId == id
        }

        if results.count == 0 {
            return ""
        }

        return results[0].groupId
    }
}
