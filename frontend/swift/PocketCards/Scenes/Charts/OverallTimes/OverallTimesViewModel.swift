//
//  OverallTimesViewModel.swift
//  PocketCards
//
//  Created by macmini on 2022/04/11.
//
//

import SwiftUI

class OverallTimesViewModel: ObservableObject {
    var language: [String: Int] = [:]
    var science: [String: Int] = [:]
    var society: [String: Int] = [:]
    var english: [String: Int] = [:]

    @Published var isLoaded = false
}
