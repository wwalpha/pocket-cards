//
//  DailyReviewViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/06/12.
//
//

import SwiftUI

class DailyReviewViewModel: ObservableObject {
    @Published var isShowError: String = ""
    @Published var isLoading = false
    @Published var isFinish = false

    var question: Question?
}
