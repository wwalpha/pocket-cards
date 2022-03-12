//
//  DailyStudyViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//

import SwiftUI

class DailyTestViewModel: ObservableObject {
    @Published var title: String = ""
    @Published var answer: String = ""
    @Published var choices: [String] = []
}
