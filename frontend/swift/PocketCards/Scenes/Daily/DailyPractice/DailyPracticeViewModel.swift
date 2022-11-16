//
//  DailyPracticeViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import SwiftUI

class DailyPracticeViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var isFinish = false
    @Published var isShowError: String = ""

    var question: Question?
}
