//
//  WeeklyTestViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

class WeeklyTestViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var isFinish = false
    @Published var isShowError: String = ""
    @Published var count: String = "0"

    var question: Question?
}
