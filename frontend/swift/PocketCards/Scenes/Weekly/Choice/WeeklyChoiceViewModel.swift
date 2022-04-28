//
//  WeeklyChoiceViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

class WeeklyChoiceViewModel: ObservableObject {
    @Published var dataRows: [Curriculum] = []
    @Published var selection = Set<String>()
    var subject: String = ""

    @Published var editMode = EditMode.inactive
}
