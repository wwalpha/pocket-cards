//
//  WeeklyPracticeViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import SwiftUI

class WeeklyPracticeViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var isFinish = false
    @Published var isShowError: String = ""

    var question: Question?
    var subject: String = ""
}
