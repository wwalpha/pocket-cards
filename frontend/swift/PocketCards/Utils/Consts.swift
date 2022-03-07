//
//  Consts.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

struct URLs {
    private static let HOST = "https://api.pkc.onecloudlabo.com"
    static let STUDY = "\(HOST)/v1/questions/study"
    static let TEST = "\(HOST)/v1/questions/study"
}

struct SUBJECT {
    static let LANGUAGE = "1"
    static let SCIENCE = "2"
    static let SOCIETY = "3"
}

struct MODE {
    static let STUDY = "1"
    static let TEST = "2"
}
