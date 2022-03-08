//
//  DailyStudyViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation
import SwiftUI

class DailyStudyViewModel: ObservableObject {
    @Published var title: String = ""
    @Published var answer: String = ""
    @Published var choices: [String] = []
    @Published var isShowError: String = ""
}
