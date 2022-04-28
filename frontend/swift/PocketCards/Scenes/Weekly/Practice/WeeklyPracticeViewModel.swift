//
//  WeeklyPracticeViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import SwiftUI

class WeeklyPracticeViewModel: ObservableObject {
//    @Published var isLoading = true
//    @Published var title: String = ""
//
    var subject: String = ""
//    var answer: String = ""
//    var choices: [String] = []

    @Published var isLoading = false
    @Published var isFinish = false

    var question: Question?
}
