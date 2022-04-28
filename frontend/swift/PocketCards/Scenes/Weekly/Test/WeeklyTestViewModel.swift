//
//  WeeklyTestViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

class WeeklyTestViewModel: ObservableObject {
//    @Published var title: String = ""
//    var answer: String = ""
//    var choices: [String] = []

    @Published var isLoading = false
    @Published var isFinish = false

    var question: Question?
}
